package com.taxi.company.model;

import jakarta.persistence.*;

@Entity
@Table(name = "regular_customer")
@PrimaryKeyJoinColumn(name = "customer_id")
public class RegularCustomer extends Customer {
    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "membership_level")
    private MembershipLevel membershipLevel = MembershipLevel.BRONZE;

    public enum MembershipLevel {
        BRONZE, SILVER, GOLD, PLATINUM
    }

    // Default constructor
    public RegularCustomer() {}

    // Getters and Setters
    public Integer getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void setLoyaltyPoints(Integer loyaltyPoints) {
        this.loyaltyPoints = loyaltyPoints;
    }

    public MembershipLevel getMembershipLevel() {
        return membershipLevel;
    }

    public void setMembershipLevel(MembershipLevel membershipLevel) {
        this.membershipLevel = membershipLevel;
    }
} 