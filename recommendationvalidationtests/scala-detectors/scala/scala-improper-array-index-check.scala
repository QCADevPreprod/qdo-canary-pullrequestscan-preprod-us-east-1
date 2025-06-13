class Test {
   def noncompliant1(){
      val color = "blue"
      val strings = List("blue", "bob")
      // ruleid: scala-improper-array-index-check
      if(strings.indexOf(color) > 0){
         println("Color not found");
      }
   }

   def noncompliant2(){
      val name = "bob"
      // ruleid: scala-improper-array-index-check
      if(name.indexOf("b") > 2){
         println("Not found");
      }
   }

   def noncompliant3(){
      val color = "blue"
      val strings = List("blue", "bob")
      // ruleid: scala-improper-array-index-check
      if(strings.indexOf(color) > 1){
         println("Not found");
      }
   }

   def noncompliant4(){
      val color = "blue"
      val strings = List("blue", "bob")
      // ruleid: scala-improper-array-index-check
      if(strings.indexOf(color) >= 1){
         println("Not found");
      }
   }

   def compliant1() {
      val color = "blue"
      val strings = List("blue", "bob")
      // ok: scala-improper-array-index-check
      if(strings.indexOf(color) > -1){
         println("Found");
      }
   }

   def compliant2(){
      val name = "bob"
      // ok: scala-improper-array-index-check
      if(name.indexOf("b") >= 0){
         println("Found");
      }
   }

   def compliant3(){
      val name = "bob"
      // ok: scala-improper-array-index-check
      if(name.indexOf("b") == 0){
         println("Found");
      }
   }
}