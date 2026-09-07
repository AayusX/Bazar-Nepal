package com.bazaarnepal.dto;

import com.bazaarnepal.domain.Product;
import java.util.List;

public class ProductConnection {
    private List<Product> items;
    private long totalCount;
    private boolean hasMore;
    private int page;

    public ProductConnection(List<Product> items, long totalCount, boolean hasMore, int page) {
        this.items = items;
        this.totalCount = totalCount;
        this.hasMore = hasMore;
        this.page = page;
    }

    public List<Product> getItems() { return items; }
    public long getTotalCount() { return totalCount; }
    public boolean isHasMore() { return hasMore; }
    public int getPage() { return page; }
}
