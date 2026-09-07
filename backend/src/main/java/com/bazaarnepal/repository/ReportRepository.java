package com.bazaarnepal.repository;

import com.bazaarnepal.domain.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, String> {

    List<Report> findByTargetIdOrderByCreatedAtDesc(String targetId);

    List<Report> findByStatusOrderByCreatedAtDesc(String status);
}
