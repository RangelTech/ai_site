import arrowRight from 'lucide-static/icons/arrow-right.svg?raw';
import arrowUpRight from 'lucide-static/icons/arrow-up-right.svg?raw';
import check from 'lucide-static/icons/check.svg?raw';
import x from 'lucide-static/icons/x.svg?raw';
import plus from 'lucide-static/icons/plus.svg?raw';
import minus from 'lucide-static/icons/minus.svg?raw';
import shield from 'lucide-static/icons/shield-check.svg?raw';
import chevron from 'lucide-static/icons/chevron-down.svg?raw';
import message from 'lucide-static/icons/message-circle.svg?raw';
import reset from 'lucide-static/icons/rotate-ccw.svg?raw';

const strip = (s: string) => s.replace(/<!--[\s\S]*?-->/g, '').replace(/\s(width|height)="\d+"/g, '');

export const ICON = {
  arrowRight: strip(arrowRight),
  arrowUpRight: strip(arrowUpRight),
  check: strip(check),
  x: strip(x),
  plus: strip(plus),
  minus: strip(minus),
  shield: strip(shield),
  chevron: strip(chevron),
  message: strip(message),
  reset: strip(reset),
};
export type IconName = keyof typeof ICON;
