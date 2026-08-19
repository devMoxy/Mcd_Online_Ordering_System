package com.mcdonaldsclone.controller;

import com.mcdonaldsclone.dto.response.CategoryResponse;
import com.mcdonaldsclone.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getMenu() {
        return ResponseEntity.ok(menuService.getMenu());
    }
}