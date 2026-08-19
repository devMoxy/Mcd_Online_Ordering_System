package com.mcdonaldsclone.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class OrderItemResponse {

    private Long menuItemId;
    private String menuItemName;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}