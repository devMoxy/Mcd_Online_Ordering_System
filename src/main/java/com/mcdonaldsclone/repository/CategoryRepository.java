package com.mcdonaldsclone.repository;

import com.mcdonaldsclone.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}