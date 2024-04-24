import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import DataTable from "@/components/datatable/DataTable";

const columns = {
    name: { title: "Name", width: "512px" },
    added: { title: "Create Date", width: "256px" },
    size: { title: "Size", width: "128px" },
};
const rows = [
    { id: 1, name: "Name 1", added: "2021-01-01", size: 10 },
    { id: 2, name: "Name 2", added: "2021-01-02", size: 20 },
    { id: 3, name: "Name 3", added: "2021-01-03", size: 30 },
];

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    component: DataTable,
    tags: ["autodocs"],
    args: {
        columns,
        rows,
    },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows100 = Array.from({ length: 100 }).map((_, i) => {
    i = i + 1;
    return { id: i, name: `Name ${i}`, added: `2021-01-0${i}`, size: i };
});

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {};

export const Selectable: Story = {
    args: {
        checked: {},
    },
};

export const Scroll: Story = {
    render: () => (
        <div className="border border-black overflow-hidden h-96 flex">
            <DataTable rows={rows100} columns={columns} />
        </div>
    ),
    args: {
        rows: rows100,
    },
};
