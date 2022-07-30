public with sharing class sftomcUtils {
  public static String stripKeywords(String bodyInput) {
    bodyInput = bodyInput.replaceAll('"_links"', '"mc_links"');
    bodyInput = bodyInput.replaceAll('"id"', '"mc_id"');
    return bodyInput;
  }
}