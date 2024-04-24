"use client";

interface Props {
    id: string;
    title: string;
    children?: React.ReactNode;
}

export default function ({ id, title, children }: Props) {
    return (
        <div className="">
            <div>{title}</div>
            <div>{children}</div>
        </div>
    );
}
