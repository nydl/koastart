/**
 * Created by tdzl2003 on 3/7/16.
 */

import {createHash} from 'crypto';

export default function md5(str) {
  return createHash('md5').update(str).digest('base64');
}
