package com.bazaarnepal.repository;

import com.bazaarnepal.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, String> {
}
