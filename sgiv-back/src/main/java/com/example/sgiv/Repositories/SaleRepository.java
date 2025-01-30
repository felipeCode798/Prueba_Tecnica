package com.example.sgiv.Repositories;

import com.example.sgiv.Entities.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    static List<Sale> findByDateTimeBetween(LocalDateTime start, LocalDateTime end) {
        return null;
    }

    @Query("SELECT s FROM Sale s WHERE s.dateTime BETWEEN :startDate AND :endDate")
    List<Sale> findSalesByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}

