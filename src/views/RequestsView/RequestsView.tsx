"use client";

import { Typography } from "antd";
import { AppLayout } from "@/components/AppLayout";

export const RequestsView = () => {
  return (
    <AppLayout>
      <Typography.Title>Requests</Typography.Title>
      <Typography.Paragraph>
        List and manage all incoming booking requests here.
      </Typography.Paragraph>
    </AppLayout>
  );
};
