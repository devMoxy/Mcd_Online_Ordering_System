package com.mcdonaldsclone.mapper;

import com.mcdonaldsclone.dto.response.CategoryResponse;
import com.mcdonaldsclone.dto.response.MenuItemResponse;
import com.mcdonaldsclone.entity.Category;
import com.mcdonaldsclone.entity.MenuItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MenuItemMapper {

    public MenuItemResponse toResponse(MenuItem item) {
        return new MenuItemResponse(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getPrice()
        );
    }

    public CategoryResponse toCategoryResponse(Category category, List<MenuItem> availableItems) {
        List<MenuItemResponse> items = availableItems.stream()
                .map(this::toResponse)
                .toList();

        return new CategoryResponse(category.getId(), category.getName(), items);
    }
}