package com.mcdonaldsclone.service.impl;

import com.mcdonaldsclone.dto.request.OrderItemRequest;
import com.mcdonaldsclone.dto.request.PlaceOrderRequest;
import com.mcdonaldsclone.dto.response.OrderResponse;
import com.mcdonaldsclone.entity.MenuItem;
import com.mcdonaldsclone.entity.OrderItem;
import com.mcdonaldsclone.entity.Orders;
import com.mcdonaldsclone.entity.User;
import com.mcdonaldsclone.enums.OrderStatus;
import com.mcdonaldsclone.exception.InvalidOrderStateException;
import com.mcdonaldsclone.exception.ResourceNotFoundException;
import com.mcdonaldsclone.mapper.OrderMapper;
import com.mcdonaldsclone.repository.MenuItemRepository;
import com.mcdonaldsclone.repository.OrderRepository;
import com.mcdonaldsclone.repository.UserRepository;
import com.mcdonaldsclone.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponse placeOrder(String userEmail, PlaceOrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Orders order = new Orders();
        order.setUser(user);
        order.setStatus(OrderStatus.PLACED);

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Menu item not found: " + itemRequest.getMenuItemId()));

            if (!menuItem.isAvailable()) {
                throw new InvalidOrderStateException(menuItem.getName() + " is currently unavailable");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(menuItem.getPrice()); // snapshot the price now, never read live later
            orderItem.setOrder(order);

            order.getOrderItems().add(orderItem);

            total = total.add(menuItem.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }

        order.setTotal(total);
        Orders saved = orderRepository.save(order);

        return orderMapper.toResponse(saved);
    }

    @Override
    public List<OrderResponse> getOrderHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    public OrderResponse getOrder(String userEmail, Long orderId) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new ResourceNotFoundException("Order not found"); // don't reveal it exists for another user
        }

        return orderMapper.toResponse(order);
    }

    @Override
    public List<OrderResponse> getAllActiveOrders() {
        return orderRepository.findAll().stream()
                .filter(order -> order.getStatus() != OrderStatus.READY)
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public OrderResponse updateStatus(Long orderId, OrderStatus newStatus) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        validateTransition(order.getStatus(), newStatus);
        order.setStatus(newStatus);

        return orderMapper.toResponse(order);
    }

    private void validateTransition(OrderStatus current, OrderStatus next) {
        boolean valid =
                (current == OrderStatus.PLACED && next == OrderStatus.PREPARING) ||
                        (current == OrderStatus.PREPARING && next == OrderStatus.READY);

        if (!valid) {
            throw new InvalidOrderStateException(
                    "Cannot move order from " + current + " to " + next);
        }
    }
}