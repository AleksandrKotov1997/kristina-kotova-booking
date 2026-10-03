"use client";

import { Typography } from "antd";
import { PageContainer } from "@/components/PageContainer";

export const BookingView = () => {
  return (
    <PageContainer withVerticalPadding>
      <Typography.Title>Booking</Typography.Title>
      <Typography.Paragraph>
        Choose a service, date, and available time slot to send a booking
        request.
      </Typography.Paragraph>
    </PageContainer>
  );
};
