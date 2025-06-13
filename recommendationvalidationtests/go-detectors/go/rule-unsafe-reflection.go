package testing

import (
    "bytes"
    "fmt"
    "reflect"
)

func unsafeReflectByNameNoncompliant(job interface{}, userInput string) {
    jobData := make(map[string]interface{})

    valueJ := reflect.ValueOf(job).Elem()

    // Noncompliant: unsafe user input passed
	// ruleid: rule-unsafe-reflection
    meth := valueJ.MethodByName(userInput)
    // Noncompliant: unsafe user input passed
	// ruleid: rule-unsafe-reflection
    jobData["color"] = valueJ.FieldByName(userInput).String()

    return jobData
}

func unsafeReflectByNameCompliant(job interface{}, userInput string) {
    jobData := make(map[string]interface{})

    valueJ := reflect.ValueOf(job).Elem()

    // Compliant: constant input passed
	//ok: rule-unsafe-reflection
    meth := valueJ.MethodByName("Name")
    // Compliant: constant input passed
	//ok: rule-unsafe-reflection
    jobData["color"] = valueJ.FieldByName("color").String()

    return jobData
}