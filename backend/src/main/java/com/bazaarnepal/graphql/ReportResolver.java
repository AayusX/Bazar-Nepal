package com.bazaarnepal.graphql;

import com.bazaarnepal.domain.Report;
import com.bazaarnepal.domain.User;
import com.bazaarnepal.dto.ReportInput;
import com.bazaarnepal.service.UserService;
import com.bazaarnepal.repository.ReportRepository;
import jakarta.validation.Valid;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.security.core.Authentication;

@Controller
public class ReportResolver {

    private final ReportRepository reportRepository;
    private final UserService userService;

    public ReportResolver(ReportRepository reportRepository, UserService userService) {
        this.reportRepository = reportRepository;
        this.userService = userService;
    }

    @MutationMapping
    public Report createReport(@Argument @Valid ReportInput input, Authentication auth) {
        User reporter = userService.getCurrentUser(auth);
        Report report = new Report();
        report.setReporter(reporter);
        report.setTargetType(input.getTargetType());
        report.setTargetId(input.getTargetId());
        report.setReason(input.getReason());
        report.setDescription(input.getDescription());
        return reportRepository.save(report);
    }
}
