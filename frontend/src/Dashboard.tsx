"use client";

import React from "react";
import { Alert } from "@/ui/components/Alert";
import { Avatar } from "@/ui/components/Avatar";
import { Badge } from "@/ui/components/Badge";
import { Button } from "@/ui/components/Button";
import { IconButton } from "@/ui/components/IconButton";
import { Table } from "@/ui/components/Table";
import { TextField } from "@/ui/components/TextField";
import { ToggleGroup } from "@/ui/components/ToggleGroup";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { FeatherSearch } from "@/subframe/core";
import { FeatherWallet } from "@/subframe/core";
import { FeatherChevronDown } from "@/subframe/core";
import { FeatherPlus } from "@/subframe/core";
import { FeatherRefreshCw } from "@/subframe/core";
import { FeatherActivity } from "@/subframe/core";
import { FeatherX } from "@/subframe/core";

function Dashboard() {
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start bg-[#0a0f2aff]">
        <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-6 py-6">
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-[#00f0ffff]">
            Dashboard
          </span>
          <div className="flex items-start gap-2">
            <TextField
              variant="filled"
              label=""
              helpText=""
              icon={<FeatherSearch />}
            >
              <TextField.Input
                placeholder="Search transactions"
                value=""
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
              />
            </TextField>
            <Button
              icon={<FeatherWallet />}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              0x7E3b...8F9d
            </Button>
          </div>
        </div>
        <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-6 py-4">
          <ToggleGroup value="" onValueChange={(value: string) => {}}>
            <ToggleGroup.Item icon={null} value="335285f2">
              Overview
            </ToggleGroup.Item>
            <ToggleGroup.Item icon={null} value="260a4223">
              Agent Config
            </ToggleGroup.Item>
            <ToggleGroup.Item icon={null} value="80f6a83d">
              Trades
            </ToggleGroup.Item>
            <ToggleGroup.Item icon={null} value="45fb60c9">
              Payments
            </ToggleGroup.Item>
            <ToggleGroup.Item icon={null} value="dfa34310">
              Social
            </ToggleGroup.Item>
            <ToggleGroup.Item icon={null} value="090125bf">
              Settings
            </ToggleGroup.Item>
          </ToggleGroup>
        </div>
        <div className="flex w-full grow shrink-0 basis-0 flex-wrap items-start">
          <div className="flex grow shrink-0 basis-0 flex-col items-start self-stretch overflow-auto">
            <div className="flex w-full flex-col items-start gap-6 border-b border-solid border-neutral-border px-6 py-6">
              <div className="flex w-full items-center gap-2">
                <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-[#8ca1ccff]">
                  Recent Trades
                </span>
                <Button
                  variant="neutral-primary"
                  iconRight={<FeatherChevronDown />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  All Trades
                </Button>
              </div>
              <Table
                header={
                  <Table.HeaderRow>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Asset</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Time</Table.HeaderCell>
                  </Table.HeaderRow>
                }
              >
                <Table.Row>
                  <Table.Cell>
                    <span className="text-body font-body text-[#00f0ffff]">
                      Buy
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        image="https://images.unsplash.com/photo-1622630998477-20aa696ecb05"
                      >
                        E
                      </Avatar>
                      <span className="text-body font-body text-[#8ca1ccff]">
                        ETH/USDT
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      0.5 ETH
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      $2,145.23
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="success">Executed</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      2m ago
                    </span>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <span className="text-body font-body text-[#ca4e98ff]">
                      Sell
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        image="https://images.unsplash.com/photo-1621416894569-0f39ed31d247"
                      >
                        B
                      </Avatar>
                      <span className="text-body font-body text-[#8ca1ccff]">
                        BTC/USDT
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      0.1 BTC
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      $43,250.00
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="error">Failed</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      5m ago
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table>
            </div>
            <div className="flex w-full flex-col items-start gap-6 px-6 py-6">
              <div className="flex w-full items-center gap-2">
                <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-[#8ca1ccff]">
                  Settlement History
                </span>
                <Button
                  variant="neutral-primary"
                  iconRight={<FeatherChevronDown />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  Last 24h
                </Button>
              </div>
              <Table
                header={
                  <Table.HeaderRow>
                    <Table.HeaderCell>Transaction ID</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Method</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Time</Table.HeaderCell>
                  </Table.HeaderRow>
                }
              >
                <Table.Row>
                  <Table.Cell>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      0x71C...9E3F
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      $1,234.56
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      Crossmint
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge>Pending</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      1h ago
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table>
            </div>
          </div>
          <div className="flex w-96 flex-none flex-col items-start self-stretch border-l border-solid border-neutral-border">
            <div className="flex w-full flex-col items-start gap-6 border-b border-solid border-neutral-border px-6 py-6">
              <span className="text-heading-3 font-heading-3 text-[#00f0ffff]">
                Quick Actions
              </span>
              <div className="flex w-full flex-col items-start gap-4">
                <Button
                  className="h-8 w-full flex-none"
                  icon={<FeatherPlus />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  New Trade
                </Button>
                <Button
                  className="h-8 w-full flex-none"
                  variant="brand-secondary"
                  icon={<FeatherRefreshCw />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  Update Config
                </Button>
                <Button
                  className="h-8 w-full flex-none"
                  variant="brand-secondary"
                  icon={<FeatherActivity />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  View Analytics
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-6 px-6 py-6">
              <Alert
                variant="brand"
                title="Trading Status"
                description="Bot is currently active and monitoring market conditions."
                actions={
                  <IconButton
                    size="medium"
                    icon={<FeatherX />}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default Dashboard;
