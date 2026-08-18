package com.mcdonaldsclone.repository;

import com.mcdonaldsclone.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Orders, Long> {

    List<Orders> findByUserIdOrderByCreatedAtDesc(Long userId);
}