import org.apache.wicket.markup.html.WebPage
import org.apache.wicket.markup.html.basic.Label
import org.apache.wicket.request.mapper.parameter.PageParameters
import org.apache.wicket.markup.html.form.TextArea

class WicketXSS extends WebPage {
  def nonCompliant1(pageParameters: PageParameters): Unit = {
    // ruleid: scala-disable-html-auto-escape
    add(new Label("test").setEscapeModelStrings(false))
  }

  def nonCompliant2(pageParameters: PageParameters): Unit = {
    // ruleid: scala-disable-html-auto-escape
    add(new TextArea("richTextEditor").setEscapeModelStrings(false))
  }

  def nonCompliant3(pageParameters: PageParameters): Unit = {
    // ruleid: scala-disable-html-auto-escape
    add(new Label("userHtmlContent").setEscapeModelStrings(false))
  }

  def compliant1(pageParameters: PageParameters): Unit = {
    // ok: scala-disable-html-auto-escape
    add(new Label("test").setEscapeModelStrings(true))
  }

  def compliant2(pageParameters: PageParameters): Unit = {
    // ok: scala-disable-html-auto-escape
    add(new TextArea("richTextEditor").setEscapeModelStrings(true))
  }

  def compliant3(pageParameters: PageParameters): Unit = {
    // ok: scala-disable-html-auto-escape
    add(new Label("userHtmlContent").setEscapeModelStrings(true))
  }
}

