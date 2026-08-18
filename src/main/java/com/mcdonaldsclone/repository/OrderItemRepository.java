package com.mcdonaldsclone.repository;

import com.mcdonaldsclone.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}