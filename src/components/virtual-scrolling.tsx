import { Component, Prop, State, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'stencil-virtual-scrolling',
  shadow: true
})
export class StencilVirtualScrolling {
  @Element() host: HTMLStencilVirtualScrollingElement;

  /**
   * Height of the container that would remain visible
   */
  @Prop() scrollContainerHeight: number;

  /**
   * for now, only fixed height rows can be rendered in the component
   */
  @Prop() rowsLength: number;

  /**
   * Fixed height of rows
   */
  @Prop() rowHeight: number;

  /**
   * function for rendering different type of lists/rows
   */
  @Prop() rowRenderer: (rowStyles, fromRow: number, toRow: number, parentStyles) => any;

  @State() state = {
    contentHeight: 0,
    startRowsFrom: 0,
    endRowsTo: 0,
    rowsThatCanBeShownInVisibleArea: 0,
    alreadyScrolledRows: 0,
    totalRowsToDisplay: undefined,
    scrollPos: undefined
  };

  componentWillLoad(){
    this.updateContent(this.state.scrollPos || 0);
  }

  componentWillUpdate(){
    this.updateContent(this.state.scrollPos || 0);
  }

  updateContent(yPos) {
    const virtualScrollContainerHeight = this.scrollContainerHeight > window.innerHeight ? window.innerHeight : this.scrollContainerHeight;
    const totalRowsToDisplay = this.rowsLength;
    const contentHeight = this.rowsLength * this.rowHeight;
    const alreadyScrolledRows = parseInt(String(yPos / this.rowHeight), 10);
    const rowsThatCanBeShownInVisibleArea = Math.ceil(virtualScrollContainerHeight / this.rowHeight);
    const startRowsFrom = parseInt(String(Math.max(0, alreadyScrolledRows)), 10);
    const endRowsTo = alreadyScrolledRows + rowsThatCanBeShownInVisibleArea;

    this.state = ({
      contentHeight: contentHeight,
      startRowsFrom,
      endRowsTo: endRowsTo,
      rowsThatCanBeShownInVisibleArea,
      totalRowsToDisplay,
      alreadyScrolledRows,
      scrollPos: yPos
    });
  }

  scrollList = (e) => this.updateContent(e.target.scrollTop);

  render() {
    const { scrollContainerHeight, rowHeight } = this;
    const totalRowHeight = this.rowsLength * rowHeight;
    const activateVirtualScroll = totalRowHeight > scrollContainerHeight;

    // Finding out maximum height of the container-
    const virtualScrollHeight = (scrollContainerHeight > window.innerHeight) ? window.innerHeight : scrollContainerHeight;
    // virtualScrollHeight = totalRowHeight < virtualScrollHeight ? totalRowHeight : virtualScrollHeight;

    return (
      <Host style={{ height: `${virtualScrollHeight}px`, overflowY: 'auto', display: 'block' }} onScroll={this.scrollList}>
        {
          activateVirtualScroll
            ? this.rowRenderer(
                { transform: `translateY(${this.state.startRowsFrom * this.rowHeight}px)`, height: `${rowHeight}px` },
                this.state.startRowsFrom,
                this.state.endRowsTo,
                { height: `${totalRowHeight}px` }
              )
            : this.rowRenderer(
                { transform: 'translateY(0px)', height: `${rowHeight}px` },
                0,
                this.rowsLength,
                { height: `${totalRowHeight}px` }
              )
        }
      </Host>
    );
  }
}
