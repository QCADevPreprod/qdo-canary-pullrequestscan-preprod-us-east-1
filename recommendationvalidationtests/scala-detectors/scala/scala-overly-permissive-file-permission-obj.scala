package perm

import java.io.IOException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.attribute.PosixFilePermission
import java.util.HashSet
import scala.collection.mutable.HashSet
import scala.jdk.CollectionConverters.SetHasAsJava
import java.nio.file.attribute.PosixFilePermissions
import java.util


class OverlyPermissiveFilePermissionObj {
  @throws[IOException]
  def dangerObjOriented(path: Path): Unit = {
    val perms = new java.util.HashSet[PosixFilePermission]()
    
    // ruleid: scala-overly-permissive-file-permission-obj
    perms.add(PosixFilePermission.OTHERS_READ)

    // ruleid: scala-overly-permissive-file-permission-obj
    perms.add(PosixFilePermission.OTHERS_WRITE)
   
    // ruleid: scala-overly-permissive-file-permission-obj
    perms.add(PosixFilePermission.OTHERS_EXECUTE)  
    Files.setPosixFilePermissions(path, perms)
  }

  @throws[IOException]
  def dangerObjOriented2(path: Path, perms: java.util.Set[PosixFilePermission]): Unit = {
    // ruleid: scala-overly-permissive-file-permission-obj
    perms.add(PosixFilePermission.OTHERS_READ)
    // ruleid: scala-overly-permissive-file-permission-obj
    perms.add(PosixFilePermission.OTHERS_WRITE)
    // ruleid: scala-overly-permissive-file-permission-obj
    perms.add(PosixFilePermission.OTHERS_EXECUTE)
    
    Files.setPosixFilePermissions(path, perms)
  }

  @throws[IOException]
  def dangerObjOriented3(path: Path): Unit = {
    var perms: scala.collection.immutable.HashSet[PosixFilePermission] = scala.collection.immutable.HashSet()
    
    // ruleid: scala-overly-permissive-file-permission-obj
    perms = perms + PosixFilePermission.OTHERS_READ
    // ruleid: scala-overly-permissive-file-permission-obj
    perms = perms + PosixFilePermission.OTHERS_READ
    // ruleid: scala-overly-permissive-file-permission-obj
    perms = perms + PosixFilePermission.OTHERS_WRITE
    // ruleid: scala-overly-permissive-file-permission-obj
    perms = perms + PosixFilePermission.OTHERS_EXECUTE

    Files.setPosixFilePermissions(path, perms.asJava)
  }

  @throws[IOException]
  def okObjOriented(path: Path): Unit = {
    val perms = new java.util.HashSet[PosixFilePermission]()
    //ok: scala-overly-permissive-file-permission-obj
    perms.add(PosixFilePermission.OWNER_READ)
    //ok: scala-overly-permissive-file-permission-obj
    perms.add(PosixFilePermission.OWNER_WRITE)
    //ok: scala-overly-permissive-file-permission-obj
    perms.add(PosixFilePermission.OWNER_EXECUTE)
    //ok: scala-overly-permissive-file-permission-obj
    perms.add(PosixFilePermission.GROUP_READ)
    //ok: scala-overly-permissive-file-permission-obj
    perms.add(PosixFilePermission.GROUP_WRITE)
    //ok: scala-overly-permissive-file-permission-obj
    perms.add(PosixFilePermission.GROUP_EXECUTE)
    Files.setPosixFilePermissions(path, perms)
  }
  @throws[IOException]
  def dangerInline(path: Nothing): Unit = {
    // ruleid: scala-overly-permissive-file-permission-obj
    Files.setPosixFilePermissions(path, PosixFilePermissions.fromString("rw-rw-rw-"))
  }
 
  @throws[IOException]
  def dangerInline2(path: Nothing): Unit = {
    // ruleid: scala-overly-permissive-file-permission-obj
    val perms = PosixFilePermissions.fromString("rw-rw-rw-")
    Files.setPosixFilePermissions(path, perms)
  }


  @throws[IOException]
  def okInline(path: Nothing): Unit = {
    //ok: scala-overly-permissive-file-permission-obj
    Files.setPosixFilePermissions(path, PosixFilePermissions.fromString("rw-rw----"))
  }
  
}