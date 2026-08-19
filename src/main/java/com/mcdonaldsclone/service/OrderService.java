package com.mcdonaldsclone.service;

import com.mcdonaldsclone.dto.request.PlaceOrderRequest;
import com.mcdonaldsclone.dto.response.OrderResponse;
import com.mcdonaldsclone.enums.OrderStatus;

import java.util.List;

public interface OrderService {

    OrderResponse placeOrder(String userEmail, PlaceOrderRequest request);

    List<OrderResponse> getOrderHistory(String userEmail);

    OrderResponse getOrder(String userEmail, Long orderId);

    List<OrderResponse> getAllActiveOrders();

    OrderResponse updateStatus(Long orderId, OrderStatus newStatus);
}