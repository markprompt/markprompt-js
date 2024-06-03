import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { ComponentPropsWithoutRef, JSXElementConstructor } from 'react';

import {
  BookIconOutline,
  ChatIconOutline,
  DiscordIcon,
  MenuIconOutline,
  NewspaperIconOutline,
  SearchIconOutline,
  SparklesIconOutline,
} from './icons.js';
import { openMarkprompt } from './Markprompt.js';
import type { MarkpromptOptions, MenuIconId, MenuItemProps } from './types.js';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp: any = props.href ? props.linkAs || 'a' : 'div';
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
        onClick={() => {
          switch (props.action) {
            case 'chat': {
              openMarkprompt('chat');
              break;
            }
            case 'ticket': {
              openMarkprompt('ticket');
              break;
            }
            case 'search': {
              openMarkprompt('search');
              break;
            }
          }
        }}
      >
        {props.iconId && <Icon className="MarkpromptMenuIcon" />}
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
            <DropdownMenu.Label className="MarkpromptDropdownMenuTitle">
              {menuConfig.title}
            </DropdownMenu.Label>
          )}
          {menuConfig.subtitle && (
            <DropdownMenu.Label className="MarkpromptDropdownMenuSubtitle">
              {menuConfig.subtitle}
            </DropdownMenu.Label>
          )}

          {(menuConfig.title || menuConfig.subtitle) && (
            <DropdownMenu.Separator className="MarkpromptDropdownMenuSeparatorSpace" />
          )}

          {menuConfig.sections && menuConfig.sections?.length > 0 && (
            <div className="MarkpromptDropdownMenuSections">
              {menuConfig.sections?.map((section, i) => {
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
              {menuConfig.footer?.map((entry, i) => {
                return (
                  <MenuEntry
                    key={`menu-footer-${i}`}
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
