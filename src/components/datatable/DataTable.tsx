"use client";

import React from "react";
import styles from "./DataTable.module.scss";
import Checkbox from "../Checkbox";
import clsx from "clsx";

export interface Column {
    title: string;
    width?: string;
}

type ArrayOrObject = [] | Record<string, any>;

interface Props {
    columns: Record<string, Column>;
    rows: ArrayOrObject[];
    checked?: Record<string, boolean>;
    header?: React.ReactNode; // React component
    onRowClick?: (row: Record<string, any>) => void;
    children?: React.ReactNode;
}

const DataTable = ({ columns, rows, checked, header, onRowClick, children }: Props) => {
    const gridTemplateColumns = Object.values(columns).map((column) => column.width || "1fr");
    gridTemplateColumns.push("auto");
    if (checked) {
        gridTemplateColumns.unshift("32px");
    }
    const style = { gridTemplateColumns: gridTemplateColumns.join(" ") };

    if (!header) {
        // We haven't been supplied a React component as a header so default it
        header = <Header columns={columns} checked={checked} />;
    }

    // The row can be an array or an object - convert it to a correctly ordered array
    function getValues(row: ArrayOrObject) {
        if (Array.isArray(row)) {
            return row;
        } else {
            return Object.keys(columns).map((key) => row[key] || "");
        }
    }

    function rowClick(row: Record<string, any>) {
        if (onRowClick) {
            onRowClick(row);
        }
    }

    return (
        <div className="flex-1 overflow-y-scroll">
            <table className={`flex flex-col ${styles["data-table"]}`}>
                <thead className="flex-1 grid sticky top-0 items-center" style={style}>
                    <tr className="contents">
                        {header}
                        {/*One auto cell on the end to span the rest of the space*/}
                        <th></th>
                    </tr>
                </thead>
                <tbody className="flex-1 grid cursor-default" style={style}>
                    {rows.map((row, i) => (
                        // Only add the onClick handler if we have a rowClick callback so the component can SSR
                        <tr key={i} className={clsx("contents", { "*:hover:bg-blue-50": onRowClick })} {...(onRowClick && { onClick: () => rowClick(row) })}>
                            {checked && (
                                <td className={styles["select"]}>
                                    <Checkbox checked={checked[(row as Record<string, any>)["id"]] || false} />
                                </td>
                            )}
                            {getValues(row).map((cell, j) => (
                                <td key={j}>
                                    <div>{cell}</div>
                                </td>
                            ))}
                            {/*One auto cell on the end to span the rest of the space*/}
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Header = ({ columns, checked }: Pick<Props, "columns" | "checked">) => {
    return (
        <>
            {checked && (
                <th className={styles["select"]}>
                    <Checkbox />
                </th>
            )}
            {Object.values(columns).map((header, i) => (
                <th key={i}>{header.title}</th>
            ))}
        </>
    );
};

export default DataTable;
