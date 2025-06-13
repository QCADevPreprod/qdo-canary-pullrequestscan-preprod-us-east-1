import (
  "fmt"
  "os"
  "os/exec"
)

func osInjectionNoncompliant(password string) {
  cmd := exec.Command("bash")
  cmdWriter, _ := cmd.StdinPipe()
  cmd.Start()

  cmdString := fmt.Sprintf("sshpass -p %s", password)

  // Noncompliant : non-static command inside Write
  // ruleid: rule-os-injection-write
  cmdWriter.Write([]byte(cmdString + "\n"))

  cmd.Wait()
}

func osInjectionCompliant() {
  cmd := exec.Command("bash")
  cmdWriter, _ := cmd.StdinPipe()
  cmd.Start()

  // Compliant : static command inside Write
  // ok: rule-os-injection-write
  cmdWriter.Write([]byte("sshpass -p 123\n"))
  cmdWriter.Write([]byte("exit"    + "\n"))

  cmd.Wait()
}