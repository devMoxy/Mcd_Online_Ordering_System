package com.mcdonaldsclone.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CategoryResponse {

    private Long id;
    private String name;
    private List<MenuItemResponse> items;
}