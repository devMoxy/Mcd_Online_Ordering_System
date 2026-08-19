package com.mcdonaldsclone.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class MenuItemResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
}