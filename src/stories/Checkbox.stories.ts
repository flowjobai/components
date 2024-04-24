import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Checkbox from "@/components/Checkbox";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    component: Checkbox,
    tags: ["autodocs"],
    argTypes: {
        checked: { description: "The checked state of the checkbox" },
        label: {
            description: "An optional label that will be displayed after the checkbox",
        },
        className: {
            control: "string",
            description: "Optional classes to apply to the container",
        },
    },
    // // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    // args: { onClick: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        checked: true,
        label: "Checkbox",
        className: "",
    },
};
