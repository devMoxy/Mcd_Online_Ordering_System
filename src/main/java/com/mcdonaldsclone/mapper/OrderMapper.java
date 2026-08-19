package com.mcdonaldsclone.mapper;

import com.mcdonaldsclone.dto.response.OrderItemResponse;
import com.mcdonaldsclone.dto.response.OrderResponse;
import com.mcdonaldsclone.entity.OrderItem;
import com.mcdonaldsclone.entity.Orders;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Orders order) {
        var items = order.getOrderItems().stream()
                .map(this::toItemResponse)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStatus().name(),
                order.getTotal(),
                order.getCreatedAt(),
                items
        );
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        var subtotal = item.getUnitPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity()));

        return new OrderItemResponse(
                item.getMenuItem().getId(),
                item.getMenuItem().getName(),
                item.getQuantity(),
                item.getUnitPrice(),
                subtotal
        );
    }
}