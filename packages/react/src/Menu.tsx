import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { ComponentPropsWithoutRef, JSXElementConstructor } from 'react';

import {
  BookIconOutline,
  ChatIconOutline,
  DiscordIcon,
  MenuIconOutline,
  NewspaperIconOutline,
  SearchIconOutline,
} from './icons.js';
import { Trigger } from './Markprompt.js';
import type { MarkpromptOptions, MenuIconId, MenuItemProps } from './types.js';

type MarkpromptMenuProps = Pick<
  MarkpromptOptions,
  'display' | 'menu' | 'trigger' | 'children'
>;

function getMenuIconById(
  iconId: MenuIconId | undefined,
): JSXElementConstructor<ComponentPropsWithoutRef<'svg'>> {
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
    default:
      return MenuIconOutline;
  }
}

function MenuEntry(props: MenuItemProps): JSX.Element {
  const Icon = getMenuIconById(props.iconId);
  return (
    <DropdownMenu.Item
      className={`MarkpromptDropdownMenuItem ${props.type === 'button' ? 'MarkpromptHighlightButton' : ''}`}
      data-type={props.type || 'link'}
      data-id={props.id}
      data-theme={props.theme}
    >
      {props.iconId && <Icon className="MarkpromptDropdownMenuIcon" />}
      {props.title}
    </DropdownMenu.Item>
  );
}

function Menu(props: MarkpromptMenuProps): JSX.Element {
  const { display, menu, trigger, children } = props;

  if (!menu) {
    return <></>;
  }

  return (
    <DropdownMenu.Root>
      <Trigger
        Component={DropdownMenu.Trigger}
        display={display}
        menu={menu}
        trigger={trigger}
      >
        {children}
      </Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="MarkpromptDropdownMenuContent"
          sideOffset={25}
          alignOffset={-4}
          align="end"
        >
          {menu.title && (
            <DropdownMenu.Label className="MarkpromptDropdownMenuTitle">
              {menu.title}
            </DropdownMenu.Label>
          )}
          {menu.subtitle && (
            <DropdownMenu.Label className="MarkpromptDropdownMenuSubtitle">
              {menu.subtitle}
            </DropdownMenu.Label>
          )}

          {(menu.title || menu.subtitle) && (
            <DropdownMenu.Separator className="MarkpromptDropdownMenuSeparatorSpace" />
          )}

          {menu.sections && menu.sections?.length > 0 && (
            <div className="MarkpromptDropdownMenuSections">
              {menu.sections?.map((section, i) => {
                return (
                  <div
                    key={`menu-section-${i}`}
                    className="MarkpromptDropdownMenuSection"
                  >
                    {section.heading && (
                      <DropdownMenu.Label className="MarkpromptDropdownMenuLabel">
                        {section.heading}
                      </DropdownMenu.Label>
                    )}
                    {section.entries?.map((entry, j) => {
                      return (
                        <MenuEntry
                          key={`menu-section-${i}-entry-${j}`}
                          {...entry}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
          {menu.footer && (
            <>
              <DropdownMenu.Separator className="MarkpromptDropdownMenuSeparatorLine" />
              {menu.footer?.map((entry, i) => {
                return (
                  <MenuEntry key={`menu-footer-${i}`} {...entry}></MenuEntry>
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
