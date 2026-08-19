package com.mcdonaldsclone.service;

import com.mcdonaldsclone.dto.response.CategoryResponse;

import java.util.List;

public interface MenuService {

    List<CategoryResponse> getMenu();
}