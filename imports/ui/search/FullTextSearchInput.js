import React, {useState} from 'react' ;
import PropTypes from 'prop-types' ;

import { useHistory } from 'react-router-dom' ;

import debounce from 'debounce' ;

import { myEncodeURIComponent } from '../../client/uri.js';

import SearchBox from '../input/SearchBox.js' ;

const THRESHOLD_HISTORY_PUSH = 3000 ; // 3 seconds
const DEBOUNCE_HISTORY_UPDATE = 500 ; // 500 ms

export default function FullTextSearchInput ( { className } ) {

  const history = useHistory();
  const [lastChange, setLastHistoryUpdate] = useState(0);
  const [value, setValue] = useState('');

  const _updateHistory = newValue => {
    const url = `/search/${myEncodeURIComponent(newValue)}` ;
    const now = new Date();
    const timeSinceLastHistoryUpdate = now - lastChange;
    if ( timeSinceLastHistoryUpdate >= THRESHOLD_HISTORY_PUSH ) history.push(url);
    else history.replace(url);
    setLastHistoryUpdate(now);
  };

  const updateHistory = debounce(_updateHistory, DEBOUNCE_HISTORY_UPDATE);

  const onChange = e => {
    setValue(e.target.value);
    updateHistory(e.target.value);
  };

  const onBlur = e => setValue('');

  return (
    <div className={className}>
      <SearchBox
        placeholder="Search a patient…"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
}
