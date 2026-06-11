"use client";

import { Typography } from "antd";
import { AppLayout } from "@/components/AppLayout";

export const BookingView = () => {
  return (
    <AppLayout>
      <Typography.Title>Booking</Typography.Title>
      <Typography.Paragraph>
        Choose a service, date, and available time slot to send a booking
        request.
      </Typography.Paragraph>
    </AppLayout>
  );
};
