import { Page } from "@playwright/test";

export class AddUpdateDialog {
  constructor(private readonly page: Page) {}

  async fillComment(content: string) {
    await this.commentField.fill(content);
  }

  async selectNthProject(index: number) {
    await this.selectProjectField.click();
    const project = this.selectProjectOptions.nth(index);
    await project.click();
  }

  async submit() {
    await this.submitButton.click();
  }

  private get commentField() {
    return this.form.locator("textarea[name=content]");
  }

  private get selectProjectField() {
    return this.form.locator(".MuiAutocomplete-root");
  }

  private get submitButton() {
    return this.form.locator("button").getByText("Senden");
  }

  private get selectProjectOptions() {
    // options are spawned outside of form, hence look inside this.page
    return this.page.locator(".MuiAutocomplete-popper p[role=option]");
  }

  private get form() {
    return this.page.getByTestId("add-update-form");
  }
}
