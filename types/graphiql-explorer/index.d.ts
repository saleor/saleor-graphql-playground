declare module "graphiql-explorer" {
  import * as React from "react";
  import { GraphQLObjectType } from "graphql";
  import type {
    GraphQLArgument,
    GraphQLEnumType,
    GraphQLField,
    GraphQLInputField,
    GraphQLScalarType,
    GraphQLSchema,
    FragmentDefinitionNode,
    ValueNode,
  } from "graphql";
  declare type Field = GraphQLField<any, any>;
  declare type GetDefaultScalarArgValue = (
    parentField: Field,
    arg: GraphQLArgument | GraphQLInputField,
    underlyingArgType: GraphQLEnumType | GraphQLScalarType
  ) => ValueNode;
  declare type MakeDefaultArg = (
    parentField: Field,
    arg: GraphQLArgument | GraphQLInputField
  ) => boolean;
  declare type Colors = {
    keyword: string;
    def: string;
    property: string;
    qualifier: string;
    attribute: string;
    number: string;
    string: string;
    builtin: string;
    string2: string;
    variable: string;
    atom: string;
  };
  declare type StyleMap = Record<string, any>;
  declare type Props = {
    query: string;
    width?: number;
    title?: string;
    schema?: GraphQLSchema | null | undefined;
    onEdit: (arg0: string) => void;
    getDefaultFieldNames?:
      | ((type: GraphQLObjectType) => Array<string>)
      | null
      | undefined;
    getDefaultScalarArgValue?: GetDefaultScalarArgValue | null | undefined;
    makeDefaultArg?: MakeDefaultArg | null | undefined;
    onToggleExplorer: () => void;
    explorerIsOpen: boolean;
    onRunOperation?: (name: string | null | undefined) => void;
    colors?: Colors | null | undefined;
    arrowOpen?: React.ReactNode | null | undefined;
    arrowClosed?: React.ReactNode | null | undefined;
    checkboxChecked?: React.ReactNode | null | undefined;
    checkboxUnchecked?: React.ReactNode | null | undefined;
    styles?:
      | {
          explorerActionsStyle?: StyleMap;
          buttonStyle?: StyleMap;
          actionButtonStyle?: StyleMap;
        }
      | null
      | undefined;
    showAttribution: boolean;
    hideActions?: boolean;
    externalFragments?: FragmentDefinitionNode[];
  };
  export declare function defaultValue(
    argType: GraphQLEnumType | GraphQLScalarType
  ): ValueNode;
  declare class ExplorerWrapper extends React.PureComponent<Props, {}> {
    static defaultValue: typeof defaultValue;
    static defaultProps: {
      width: number;
      title: string;
    };
    render(): JSX.Element;
  }
  export default ExplorerWrapper;
}
