/*!
 * Copyright (c) 2017-present Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
declare const tokenTypes: readonly ["attribute", "id", "class", "comma", "combinator", "pseudo-element", "pseudo-class", "type"];
export declare type TokenType = typeof tokenTypes[number];
export declare type Base = {
    length: number;
    content: string;
    pos: number[];
};
export declare type Type = Base & {
    type: 'type';
    name?: string;
    namespace?: string;
};
export declare type PseudoClass = Base & {
    type: 'pseudo-class';
    name: string;
    argument: string | undefined;
    subtree: AST | undefined;
};
export declare type PseudoElement = Base & {
    type: 'pseudo-element';
    name: string;
};
export declare type Combinator = Base & {
    type: 'combinator';
};
export declare type Comma = Base & {
    type: 'comma';
};
export declare type Class = Base & {
    type: 'class';
    name: string;
};
export declare type Id = Base & {
    type: 'id';
    name: string;
};
export declare type Attribute = Base & {
    type: 'attribute';
    namespace?: string;
    caseSensitive?: string;
    name: string;
    operator?: string;
    value?: string;
};
export declare type Atom = Attribute | Id | Class | Comma | Combinator | PseudoClass | PseudoElement | Type;
export declare type Atoms = Atom[];
export declare type AtomOrString = Atom | string;
export declare type AtomsOrStrings = AtomOrString[];
export declare type Strings = {
    str: string;
    start: number;
}[];
export interface Complex {
    type: 'complex';
    combinator: ' ' | '+' | '~' | '>';
    right: AST;
    left: AST | undefined;
}
export interface Compound {
    type: 'compound';
    compound: AST[];
}
export interface List {
    type: 'list';
    list: AST[];
}
export declare type AST = Attribute | Id | Class | PseudoClass | PseudoElement | Type | Complex | Compound | List;
export interface ParserOptions {
    recursive?: boolean;
    list?: boolean;
}
export declare function isAtoms(tokens: AtomsOrStrings): tokens is Atoms;
export declare function isAST(tokens: Atoms): tokens is (Attribute | Id | Class | PseudoClass | PseudoElement | Type)[];
export {};
//# sourceMappingURL=types.d.ts.map