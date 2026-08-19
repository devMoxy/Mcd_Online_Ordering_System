package com.mcdonaldsclone.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private String status;
    private BigDecimal total;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
}