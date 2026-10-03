"use client";

import { Typography } from "antd";
import { PageContainer } from "@/components/PageContainer";

export const ServicesView = () => {
  return (
    <PageContainer withVerticalPadding>
      <Typography.Title>Services</Typography.Title>
      <Typography.Paragraph>
        Explore lash and brow services available for booking.
      </Typography.Paragraph>
    </PageContainer>
  );
};
