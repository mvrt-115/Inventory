var React = require('react');
var ReactDOM = require('react-dom');

import PartsList from 'partsList';
import PartView from 'partView';
import BreadcrumbNav from 'breadcrumbNav';

ReactDOM.render(
    <div>
        <BreadcrumbNav/>
        <PartView/>
        <PartsList/>
    </div>,
  document.getElementById('app')
);
