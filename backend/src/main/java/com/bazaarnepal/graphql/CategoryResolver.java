package com.bazaarnepal.graphql;

import com.bazaarnepal.domain.Category;
import com.bazaarnepal.repository.CategoryRepository;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class CategoryResolver {

    private final CategoryRepository categoryRepository;

    public CategoryResolver(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @QueryMapping
    public List<Category> categories() {
        return categoryRepository.findAll();
    }
}
