import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ExampleApp } from '../example/ExampleApp';

describe('ExampleApp', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ExampleApp />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
