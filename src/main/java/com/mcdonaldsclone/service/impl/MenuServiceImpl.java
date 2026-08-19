package com.mcdonaldsclone.service.impl;

import com.mcdonaldsclone.dto.response.CategoryResponse;
import com.mcdonaldsclone.entity.Category;
import com.mcdonaldsclone.entity.MenuItem;
import com.mcdonaldsclone.mapper.MenuItemMapper;
import com.mcdonaldsclone.repository.CategoryRepository;
import com.mcdonaldsclone.repository.MenuItemRepository;
import com.mcdonaldsclone.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final MenuItemMapper menuItemMapper;

    @Override
    public List<CategoryResponse> getMenu() {
        List<Category> categories = categoryRepository.findAll();
        List<MenuItem> availableItems = menuItemRepository.findByAvailableTrue();

        Map<Long, List<MenuItem>> itemsByCategory = availableItems.stream()
                .collect(Collectors.groupingBy(item -> item.getCategory().getId()));

        return categories.stream()
                .map(category -> menuItemMapper.toCategoryResponse(
                        category,
                        itemsByCategory.getOrDefault(category.getId(), List.of())
                ))
                .toList();
    }
}