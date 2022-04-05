import { LightningElement, api, track } from "lwc";
import {
  log,
  sortAsc,
  sortDesc,
  sortAscByProperty,
  sortDescByProperty
} from "c/utility";

export default class Multipicklist extends LightningElement {
  @api fieldLabel = "Multipicklist";
  @api _readOnly = false;
  @api options = [
    { value: "a", label: "a", isSelected: false, isVisible: true },
    { value: "b", label: "b", isSelected: false, isVisible: true }
  ];
  @api selection = "";
  @api placeholderInput = "No options selected";
  @api noResultMsg = "No results";
  @api selectedValues = "";

  connectedCallback() {
    log("Test");
    var arr = [1, 2, 3];
    arr = sortDesc(arr);
    console.log("@@@ sort desc ", arr);
    arr = sortAsc(arr);
    console.log("@@@ sort ", arr);
  }

  /* EVENT HANDLERS - START */

  filterOptions(event) {
    this.selection = event.target.value;
    let opts = [...this.options];
    opts.forEach((item) => {
      item.isVisible = item.label.includes(this.selection);
    });
    this.options = opts;
  }

  handleClickSelection(event) {
    if (!this._readOnly) {
      let opts = [...this.options];
      let val = event.currentTarget.dataset.v;

      opts.forEach((o) => {
        if (o.value == val) {
          o.isSelected = !o.isSelected;
        }
      });

      this.placeholderInput =
        opts.filter((o) => {
          return o.isSelected;
        }).length + " options selected";

      this.options = opts;

      this.selectedValues = opts
        .filter((o) => {
          return o.isSelected;
        })
        .map((o) => {
          return o.value;
        })
        .join(";");

      this.dispatchEvent(
        new CustomEvent("valueselected", {
          detail: { value: this.selectedValues }
        })
      );

      event.preventDefault();
      this.template.querySelector("input").focus();
    }
  }

  clickInputHandler(event) {
    this.template
      .querySelector(".slds-icon_container")
      .classList.toggle("isOpen");
    this.template.querySelector(".cstm-hide").classList.toggle("hide");
  }

  focusOutHandler(event) {
    this.template.querySelector(".cstm-hide").classList.add("hide");
  }

  /* GETTER AND SETTER - START */

  get hasResult() {
    return (
      this.options.filter((o) => {
        return o.isVisible;
      }).length > 0
    );
  }

  /* GETTER AND SETTER - START */
}