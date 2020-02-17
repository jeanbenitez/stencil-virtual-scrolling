import { Component, h } from '@stencil/core';

@Component({
  tag: 'virtual-scrolling-demo',
  shadow: true
})
export class VirtualScrollingDemo {
  data = Array(50_000).fill(0).map((_, i) => i+1);

  render() {
    return (
      <stencil-virtual-scrolling
        scrollContainerHeight={200}
        rowHeight={25}
        rowsLength={this.data.length}
        rowRenderer={this.contentRenderer}
      />
    );
  }

  renderRows = (fromRow, toRow, styles) => {
    const generatedRows = [];
    for (let i = fromRow; i < toRow; i++) {
      generatedRows.push(<li style={styles} innerHTML={'List item ' + i} />);
    }
    return generatedRows;
  }

  contentRenderer = (rowStyles, fromRow, toRow, parentStyles) => {
    return (
      <ul style={parentStyles}>
        {this.renderRows(fromRow, toRow, rowStyles)}
      </ul>
    );
  }
}
