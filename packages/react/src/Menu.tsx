import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { ComponentProps, ElementType, JSX } from 'react';

import {
  BookIconOutline,
  ChatIconOutline,
  DiscordIcon,
  MenuIconOutline,
  NewspaperIconOutline,
  SearchIconOutline,
  SparklesIconOutline,
} from './icons.js';
import type { MarkpromptOptions, MenuIconId, MenuItemProps } from './types.js';
import { openMarkprompt } from './utils.js';

function getMenuIconById(
  iconId: MenuIconId | undefined,
): ElementType<ComponentProps<'svg'>> {
  switch (iconId) {
    case 'book':
      return BookIconOutline;
    case 'chat':
      return ChatIconOutline;
    case 'discord':
      return DiscordIcon;
    case 'magnifying-glass':
      return SearchIconOutline;
    case 'newspaper':
      return NewspaperIconOutline;
    case 'sparkles':
      return SparklesIconOutline;
    default:
      return MenuIconOutline;
  }
}

function MenuEntry(
  props: MenuItemProps & { linkAs?: MarkpromptOptions['linkAs'] },
): JSX.Element {
  const Icon = getMenuIconById(props.iconId);

  const Comp = props.href ? (props.linkAs ?? 'a') : 'div';

  return (
    <DropdownMenu.Item asChild>
      <Comp
        className={`MarkpromptDropdownMenuItem ${
          props.type === 'button' ? 'MarkpromptHighlightButton' : ''
        }`}
        data-type={props.type || 'link'}
        data-id={props.id}
        data-theme={props.theme}
        href={props.href}
        target={props.target}
        onClick={async () => {
          if (!props.action) return;
          await openMarkprompt(props.action);
        }}
      >
        {props.iconId && (
          <Icon className="MarkpromptMenuIcon" aria-hidden="true" />
        )}
        {props.title}
      </Comp>
    </DropdownMenu.Item>
  );
}

type MarkpromptMenuProps = Pick<
  MarkpromptOptions,
  'display' | 'menu' | 'trigger' | 'linkAs' | 'children'
> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function Menu(props: MarkpromptMenuProps): JSX.Element {
  const { menu: menuConfig, linkAs, open, onOpenChange, children } = props;

  if (!menuConfig) {
    return <></>;
  }

  return (
    <DropdownMenu.Root onOpenChange={onOpenChange} open={open}>
      {children}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="MarkpromptDropdownMenuContent"
          sideOffset={25}
          alignOffset={-4}
          align="end"
        >
          {menuConfig.title && (
            // biome-ignore lint/a11y/noLabelWithoutControl: this is a div, not a label
            <DropdownMenu.Label className="MarkpromptDropdownMenuTitle">
              {menuConfig.title}
            </DropdownMenu.Label>
          )}
          {menuConfig.subtitle && (
            // biome-ignore lint/a11y/noLabelWithoutControl: this is a div, not a label
            <DropdownMenu.Label className="MarkpromptDropdownMenuSubtitle">
              {menuConfig.subtitle}
            </DropdownMenu.Label>
          )}

          {(menuConfig.title || menuConfig.subtitle) && (
            <DropdownMenu.Separator className="MarkpromptDropdownMenuSeparatorSpace" />
          )}

          {menuConfig.sections && menuConfig.sections?.length > 0 && (
            <div className="MarkpromptDropdownMenuSections">
              {menuConfig.sections?.map((section) => {
                return (
                  <div
                    key={`menu-section-${section.heading}-${section.entries.map((x) => x.title).join('-')}`}
                    className="MarkpromptDropdownMenuSection"
                  >
                    {section.heading && (
                      // biome-ignore lint/a11y/noLabelWithoutControl: this is a div, not a label
                      <DropdownMenu.Label className="MarkpromptDropdownMenuLabel">
                        {section.heading}
                      </DropdownMenu.Label>
                    )}
                    {section.entries?.map((entry) => {
                      return (
                        <MenuEntry
                          key={`menu-section-entry-${entry.title}`}
                          {...entry}
                          linkAs={linkAs}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
          {menuConfig.footer && (
            <>
              <DropdownMenu.Separator className="MarkpromptDropdownMenuSeparatorLine" />
              {menuConfig.footer?.map((entry) => {
                return (
                  <MenuEntry
                    key={`menu-footer-${entry.title}`}
                    {...entry}
                    linkAs={linkAs}
                  />
                );
              })}
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export { Menu };
