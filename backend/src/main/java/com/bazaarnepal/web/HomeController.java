package com.bazaarnepal.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "name", "Bazaar Nepal API",
                "status", "running",
                "graphql", "/graphql",
                "graphiql", "/graphiql",
                "subscriptions", "/subscriptions"
        );
    }
}
