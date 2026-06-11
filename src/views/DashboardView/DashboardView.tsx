"use client";

import { Typography } from "antd";
import { AppLayout } from "@/components/AppLayout";

export const DashboardView = () => {
  return (
    <AppLayout>
      <Typography.Title>Dashboard</Typography.Title>
      <Typography.Paragraph>
        Overview of booking request metrics and current processing status.
      </Typography.Paragraph>
    </AppLayout>
  );
};
