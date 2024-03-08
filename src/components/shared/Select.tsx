import classNames from "classnames";
import React, { CSSProperties, useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import ReactSelect, {
  components,
  GroupBase,
  OptionProps,
  Props,
} from "react-select";

const MoreSelectedBadge = ({ items }: any) => {
  const title = items.join(", ");
  const length = items.length;
  const label = `+${length}`;

  return (
    <p title={title} className="p-1 text-sm bg-background-700 rounded-sm">
      {label}
    </p>
  );
};

const MultiValue = ({ index, getValue, ...props }: any) => {
  const maxToShow = 1;
  const overflow: any = getValue()
    .slice(maxToShow)
    .map((x: any) => x.label);

  return index < maxToShow ? (
    <components.MultiValue {...props} />
  ) : index === maxToShow ? (
    <MoreSelectedBadge items={overflow} />
  ) : null;
};

const Option: React.ComponentType<
  OptionProps<unknown, boolean, GroupBase<unknown>>
> = ({ innerRef, getValue, children, innerProps, ...props }) => {
  const { className, ...divProps } = innerProps;

  return (
    <div
      ref={innerRef}
      className={classNames(
        "cursor-pointer relative px-3 py-2 transition duration-300",
        props.isFocused && "bg-white/20 text-primary-300",
        className
      )}
      {...divProps}
    >
      {children}

      {props.isSelected && (
        <AiFillCheckCircle className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600 rounded-full bg-white" />
      )}
    </div>
  );
};

const Select = React.forwardRef<any, Props>(
  ({ components, styles, ...props }, ref) => {
    const [portalTarget, setPortalTarget] = React.useState<HTMLElement>();

    useEffect(() => {
      setPortalTarget(document.body);
    }, []);

    return (
      <ReactSelect
        ref={ref}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "#ef4444",
            primary75: "#f87171",
            primary50: "#fca5a5",
            primary20: "#fecaca",
          },
        })}
        styles={
          {
            control: (provided: any) => {
              return {
                ...provided,
                backgroundColor: "#1a1a1a",
                minWidth: "12rem",
                maxWidth: "14rem",
              };
            },
            menu: (provided: any) => {
              return { ...provided, backgroundColor: "#1a1a1a" };
            },
            menuPortal: (provided: any) => ({ ...provided, zIndex: 9999 }),
            singleValue: (provided: any) => {
              return { ...provided, color: "#fff" };
            },
            multiValue: (provided: any) => {
              return {
                ...provided,
                backgroundColor: "#262626",
                maxWidth: "70%",
              };
            },
            multiValueLabel: (provided: any) => {
              return { ...provided, color: "white" };
            },
            multiValueRemove: (provided: any) => {
              return {
                ...provided,
                color: "gray",
                ":hover": {
                  backgroundColor: "transparent",
                  color: "white",
                },
                transition: "all 300ms",
              };
            },

            input: (provided: any) => {
              return { ...provided, color: "white" };
            },

            ...styles,
          } as any
        }
        hideSelectedOptions={false}
        noOptionsMessage={() => "No options"}
        components={{ MultiValue, Option, ...components }}
        isClearable
        menuPortalTarget={portalTarget}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";

export default React.memo(Select);
