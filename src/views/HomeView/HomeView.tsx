"use client";

import { Typography } from "antd";
import { AppLayout } from "@/components/AppLayout";

export const HomeView = () => {
  return (
    <AppLayout>
      <Typography.Title>BookFlow Admin Dashboard</Typography.Title>
      <Typography.Paragraph>
        This is the admin panel for managing booking requests.
      </Typography.Paragraph>
    </AppLayout>
  );
};
